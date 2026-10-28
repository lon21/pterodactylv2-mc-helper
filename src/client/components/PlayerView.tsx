import { Button, ContentBox } from '@pterodactyl/sdk';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export default function PlayerView({ playerUuid, nickname, isOp = false }: { playerUuid: string; nickname: string; isOp?: boolean }) {

	const [copied, setCopied] = useState(false);
	const [isOpState, setIsOpState] = useState(isOp);
	
	const handleCopy = () => {
		navigator.clipboard.writeText(playerUuid);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<ContentBox>
			<div className='mchl:overflow-x-auto'>
				<table className='mchl:w-full mchl:border-collapse'>
					<thead>
						<tr className='mchl:border-b mchl:border-neutral-800 mchl:text-sm mchl:font-semibold mchl:uppercase mchl:tracking-wider mchl:text-neutral-400'>
							<th className='mchl:py-4 mchl:px-6 mchl:text-left'>Player</th>
							<th className='mchl:py-4 mchl:px-6 mchl:text-center'>UUID</th>
							<th className='mchl:py-4 mchl:px-6 mchl:text-center'>Actions</th>
						</tr>
					</thead>
					<tbody className='mchl:divide-y mchl:divide-neutral-800/60'>
						<tr className='mchl:transition hover:mchl:bg-neutral-800/30'>
							<td className='mchl:py-4 mchl:px-6 mchl:text-left mchl:align-middle'>
								<div className='mchl:flex mchl:items-center mchl:gap-4'>
									<img
										src={`https://mc-heads.net/avatar/${playerUuid.replaceAll('-', '')}`}
										alt={nickname}
										className='mchl:w-12 mchl:h-12 mchl:rounded-lg mchl:border mchl:border-neutral-700/70 mchl:shadow'
										style={{ imageRendering: 'pixelated' }}
									/>
									<span className='mchl:text-base mchl:font-bold mchl:text-white mchl:leading-none'>
										{ nickname } { isOp && <span style={{ color: '#f87171' }}>(OP)</span> }
									</span>
								</div>
							</td>

							<td className='mchl:py-4 mchl:px-6 mchl:text-center mchl:align-middle'>
								<div className='mchl:inline-flex mchl:items-center mchl:gap-2.5 mchl:bg-neutral-900 mchl:border mchl:border-neutral-800 mchl:px-3.5 mchl:py-2 mchl:rounded-lg'>
									<span className='mchl:font-mono mchl:text-sm mchl:text-neutral-300'>
										{playerUuid}
									</span>
									<button
										type='button'
										onClick={handleCopy}
										title={copied ? 'Copied!' : 'Copy UUID'}
										className='mchl:p-1.5 mchl:rounded hover:mchl:bg-neutral-800 mchl:text-neutral-400 hover:mchl:text-white mchl:transition'
									>
										{copied ? (
											<Check className='mchl:w-4 mchl:h-4 mchl:text-emerald-400' />
										) : (
											<Copy className='mchl:w-4 mchl:h-4' />
										)}
									</button>
								</div>
							</td>

							<td className='mchl:py-4 mchl:px-6 mchl:text-center mchl:align-middle'>
								<div className='mchl:flex mchl:items-center mchl:justify-center mchl:gap-2'>
									<Button color='primary'>
										{isOpState ? 'Revoke OP' : 'Grant OP'}
									</Button>

									<Button color='green'>
										Change Gamemode
									</Button>

									<Button color='orange'>
										Kick
									</Button>

									<Button.Danger>
										Ban
									</Button.Danger>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</ContentBox>
	)
}