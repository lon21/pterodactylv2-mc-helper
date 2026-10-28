import { http } from '@pterodactyl/sdk';

export interface ServerStatus {
  current_state: 'offline' | 'starting' | 'running' | 'stopping' | (string & {});
  is_uspended: boolean;
  resources: {
    memory_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
    uptime: number;
  };
}

const getStatus = async (serverId: string) => {
	const res = await http.get(`/api/client/servers/${serverId}/resources`);
	
	if (res.status !== 200) {
		throw new Error(`Failed to fetch server status: ${res.statusText}`);
	}

	return res.data?.attributes as ServerStatus;
}

export default getStatus;