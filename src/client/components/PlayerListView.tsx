import { Button, ContentBox, Input, Switch, TitledGreyBox } from '@pterodactyl/sdk';
import { useEffect, useState } from 'react';
import { ServerStatus } from '../api/getStatus';
import PlayerView from './PlayerView';
import { UserFile } from '../api/getUserFile';

export default function PlayerListView({ status, players }: { status: ServerStatus['current_state'], players?: UserFile[] }) {

	const isOnline = status === 'running';
	const [onlyOnline, setOnlyOnline] = useState(false);

	useEffect(() => {
		if (!isOnline) {
			setOnlyOnline(false);
		}
	}, [isOnline]);

	return (
		<TitledGreyBox title={'Player Management'}>
			<div className='mchl:flex mchl:flex-col mchl:gap-2 mchl:mb-4'>
				<div className={`mchl:flex mchl:items-center mchl:gap-3 ${!isOnline ? 'mchl:opacity-50 mchl:cursor-not-allowed' : ''}`}>
					<span className='mchl:text-sm mchl:text-neutral-200'>Online players only</span>
					<Switch
						checked={onlyOnline && isOnline}
						onChange={() => {
							if (isOnline) {
								setOnlyOnline((prev) => !prev);
							}
						}}
					/>
				</div>

				{!isOnline && (
					<div className='mchl:text-xs mchl:text-amber-400 mchl:bg-amber-950/40 mchl:border mchl:border-amber-800/50 mchl:rounded mchl:px-3 mchl:py-2 mchl:w-fit'>
						Server status is: <span className='mchl:font-semibold mchl:uppercase'>{status ?? 'offline'}</span>. Searching for online players is not available.
					</div>
				)}
			</div>

			<ContentBox title={'Search for player'}>

				<div className='mchl:flex mchl:items-center mchl:gap-3'>
					<Input
						placeholder='Enter player nickname...'
						className='mchl:flex-1'
					/>
					<Button color='primary' className='mchl:shrink-0'>
						Search
					</Button>
				</div>
			</ContentBox>

			{ players?.length ? (
				players.map((p) => {
					return <PlayerView isOp={p.isOp} key={p.uuid} playerUuid={p.uuid} nickname={p.name} />;
				})
			) : (
				<div className='mchl:text-sm mchl:text-neutral-400 mchl:mt-4'>
					No players found
				</div>
			)}
		</TitledGreyBox>
	)
}