/**
 * Kits admin shell: the empty, loading and error states (docs/plugins/kits-plugin-ui-spec.md), shared by every part that loads.
 */
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

/**
 * Nothing to show yet.
 *
 * @param {Object}  props
 * @param {string}  props.title    One line.
 * @param {Element} props.children More words.
 * @param {Object}  props.action   The next step as a control: { label, href } for a link or { label, onClick } for a
 *                                 button ("Connect a mailbox", "Choose post types"). An empty state with no way
 *                                 forward is a dead end, so a screen passes one wherever there is a next step.
 */
export function EmptyState( { title, children, action } ) {
	let control = null;
	if ( action?.label && action.href ) {
		control = (
			<a
				className="kits-shell-button is-secondary kits-shell-state__action"
				href={ action.href }
			>
				{ action.label }
			</a>
		);
	} else if ( action?.label && action.onClick ) {
		control = (
			<button
				type="button"
				className="kits-shell-button is-secondary kits-shell-state__action"
				onClick={ action.onClick }
			>
				{ action.label }
			</button>
		);
	}
	return (
		<div className="kits-shell-state is-empty">
			<p className="kits-shell-state__title">{ title }</p>
			{ children }
			{ control }
		</div>
	);
}

/**
 * Loading.
 *
 * @param {Object} props
 * @param {string} props.label Words beside the spinner.
 */
export function LoadingState( { label } ) {
	return (
		<div className="kits-shell-state is-loading" role="status">
			<Spinner className="kits-shell-spinner" />
			<p className="kits-shell-state__title">
				{ label || __( 'Loading…', 'kits-core' ) }
			</p>
		</div>
	);
}

/**
 * Something failed: the message and a Try again button.
 *
 * @param {Object}   props
 * @param {string}   props.message What went wrong.
 * @param {Function} props.onRetry Try again.
 */
export function ErrorState( { message, onRetry } ) {
	return (
		<div className="kits-shell-state is-error" role="alert">
			<p className="kits-shell-state__title">
				{ __( 'This could not be loaded.', 'kits-core' ) }
			</p>
			{ message && <p>{ message }</p> }
			{ onRetry && (
				<button
					type="button"
					className="kits-shell-button is-secondary"
					onClick={ onRetry }
				>
					{ __( 'Try again', 'kits-core' ) }
				</button>
			) }
		</div>
	);
}
