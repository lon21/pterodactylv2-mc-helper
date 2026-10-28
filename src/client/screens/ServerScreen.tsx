import { useState, useEffect } from 'react';
import { ServerContentBlock } from '@pterodactyl/sdk';
import LoadingView from '../components/LoadingView';
import PlayerListView from '../components/PlayerListView';
import getStatus, { ServerStatus } from '../api/getStatus';
import getUserFile, { UserFile } from '../api/getUserFile';

export default function ServerScreen() {
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState<ServerStatus['current_state']>('offline');
	const [players, setPlayers] = useState<UserFile[]>([]);

	useEffect(() => {
		const serverId = window.location.pathname.split('/')[2];

		const checkStatus = async () => {
			try {
				const data = await getStatus(serverId);
				setStatus(data.current_state);

				const players = await getUserFile(serverId);
				setPlayers(players);
			} catch (err) {
				console.error(err);
				setStatus('offline');
			} finally {
				setLoading(false);
			}
		};

		checkStatus();

		const intervalId = setInterval(checkStatus, 5000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<ServerContentBlock title={'Minecraft Helper'}>
			{loading ? <LoadingView /> : <PlayerListView players={players} status={status} />}
		</ServerContentBlock>
	);
}