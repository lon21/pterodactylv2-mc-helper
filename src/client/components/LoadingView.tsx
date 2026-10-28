import { Spinner } from '@pterodactyl/sdk';

export default function LoadingView() {
	return (
		<div>
			<Spinner centered size='large' />
			<p className='mchl:text-center mchl:text-neutral-400 mchl:mt-4'>
				Loading...
			</p>
			<img src="https://media.tenor.com/_8_6x5Y5-XIAAAAM/orange-cat-loading.gif" alt="Cat loading" className='mchl:block mchl:mx-auto mchl:my-6 mchl:w-36 mchl:h-auto' />
		</div>
	)
}