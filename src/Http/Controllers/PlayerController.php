<?php

namespace McHelper\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Pterodactyl\Models\Server;

class PlayerController extends Controller
{
    public function getOnlinePlayers(Server $server): JsonResponse
    {
        $allocation = $server->allocation;
        if (!$allocation) {
            return new JsonResponse([
                'online' => false,
                'count' => 0,
                'max' => 0,
                'players' => [],
            ]);
        }

        $port = $allocation->port;
        $host = $allocation->alias ?: $allocation->ip;

        if (in_array($host, ['127.0.0.1', '0.0.0.0', 'localhost'])) {
            $host = $server->node->fqdn ?: (gethostbyname('wings') !== 'wings' ? 'wings' : '127.0.0.1');
        }

        $result = $this->pingMinecraftServer($host, $port);

        return new JsonResponse($result);
    }

    private function pingMinecraftServer(string $host, int $port, float $timeout = 1.5): array
    {
        $socket = @stream_socket_client("tcp://{$host}:{$port}", $errno, $errstr, $timeout);
        if (!$socket) {
            return [
                'online' => false,
                'count' => 0,
                'max' => 0,
                'players' => [],
            ];
        }

        stream_set_timeout($socket, (int) $timeout);

        $handshake = "\x00\x2f" . pack('C', strlen($host)) . $host . pack('n', $port) . "\x01";
        $this->writeVarInt($socket, strlen($handshake));
        fwrite($socket, $handshake);

        fwrite($socket, "\x01\x00");

        $length = $this->readVarInt($socket);
        if ($length <= 0) {
            fclose($socket);
            return ['online' => false, 'count' => 0, 'max' => 0, 'players' => []];
        }

        $this->readVarInt($socket);
        $dataLength = $this->readVarInt($socket);

        $data = '';
        while (strlen($data) < $dataLength) {
            $chunk = fread($socket, min(1024, $dataLength - strlen($data)));
            if ($chunk === false || strlen($chunk) === 0) {
                break;
            }
            $data .= $chunk;
        }

        fclose($socket);

        $json = json_decode($data, true);
        if (!$json || !isset($json['players'])) {
            return [
                'online' => false,
                'count' => 0,
                'max' => 0,
                'players' => [],
            ];
        }

        $sample = $json['players']['sample'] ?? [];
        $playerList = array_map(function ($player) {
            return [
                'name' => $player['name'],
                'uuid' => $player['id'],
            ];
        }, $sample);

        return [
            'online' => true,
            'count' => $json['players']['online'] ?? 0,
            'max' => $json['players']['max'] ?? 0,
            'players' => $playerList,
        ];
    }

    private function writeVarInt($socket, int $value): void
    {
        while (($value & ~0x7F) !== 0) {
            fwrite($socket, chr(($value & 0x7F) | 0x80));
            $value >>= 7;
        }
        fwrite($socket, chr($value));
    }

    private function readVarInt($socket): int
    {
        $value = 0;
        $i = 0;
        while (true) {
            $byte = fread($socket, 1);
            if ($byte === false || strlen($byte) === 0) {
                return 0;
            }
            $b = ord($byte);
            $value |= ($b & 0x7F) << ($i * 7);
            if (($b & 0x80) === 0) {
                break;
            }
            $i++;
            if ($i > 5) {
                return 0;
            }
        }
        return $value;
    }
}