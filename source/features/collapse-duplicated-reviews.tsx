import './collapse-duplicated-reviews.css';
import select from 'select-dom';
import * as pageDetect from 'github-url-detection';

import features from '.';

function init(): void {
	const singleReviewThreadComments = select.all('.review-comment.unminimized-comment:only-child');
	for (const comment of singleReviewThreadComments) {
		if (!select.exists(`.review-comment#${comment.id}:not(:only-child)`)) { // The review comment is not a duplicate
			continue;
		}

		const details = comment.closest('details')!;
		details.open = false;
		details.classList.add('rgh-duplicated-review');

		// Change the link in the thread header to point to the original comment instead of the file diff
		const commentUrl = new URL(location.href);
		commentUrl.hash = comment.id;
		const threadHeaderLink = select('summary a', details)!;
		threadHeaderLink.href = commentUrl.href;
	}
}

void features.add(import.meta.url, {
	include: [
		pageDetect.isPRConversation,
	],
	deduplicate: 'has-rgh-inner',
	init,
});
