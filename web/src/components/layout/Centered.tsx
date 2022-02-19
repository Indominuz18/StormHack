import React, {PropsWithChildren} from 'react';
import Styles from './Centered.module.scss';

namespace Centered {
	export interface Props {
		vertical?: boolean;
		horizontal?: boolean;
		className?: string;
		containerClassName?: string;
	}
}

function Centered(props: PropsWithChildren<Centered.Props>) {
	return (
		<div className={[Styles.container, props.containerClassName,
			props.horizontal ? Styles.horizontal : null,
			props.vertical ? Styles.vertical : null
		].filter(e => e != null).join(' ')}>
			<div className={props.className}>
				{props.children}
			</div>
		</div>
	);
}

export default Centered;
