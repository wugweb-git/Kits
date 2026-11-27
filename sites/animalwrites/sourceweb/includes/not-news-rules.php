<?php
/**
 * Animal Writes rules for what is not a news report, moved out of SourceWeb 0.4.0 (second pass, 0.4.1). SourceWeb asks
 * this filter after its own archive/tag-page rule: a job vacancy from a source that is not an opportunity source
 * ("... vacancy at ...", "... recruitment 2026 - apply offline", /job-updates/ addresses, the Indian job sites). The same
 * rule as the workers' sources.not_an_article(); a story about vacancies ("flags 63.81% vacancies in ...") passes.
 *
 * @package animalwrites-sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter(
	'sourceweb_not_news_reason',
	function ( $reason, $title, $url, $type ) {
		if ( '' !== (string) $reason ) {
			return $reason;
		}
		if ( function_exists( 'sourceweb_is_type' ) && sourceweb_is_type( $type, 'opportunity' ) ) {
			return $reason; // jobs belong in Opportunities
		}
		$title = (string) $title;
		$path  = (string) wp_parse_url( (string) $url, PHP_URL_PATH ) . '/';
		$host  = strtolower( (string) wp_parse_url( (string) $url, PHP_URL_HOST ) );
		if ( preg_match( '/(?:^|\.)(?:freejobalert|sarkariresult|sarkarinaukri\w*|employmentnews|naukri|indeed|freshersworld|jobsarkari|govtjobsalert\w*)\.(?:com|in|co\.in|gov\.in|org)$/i', $host )
			|| preg_match( '#/(?:jobs?|job-updates?|careers?|recruitments?|vacanc(?:y|ies))(?:/|-)#i', $path )
			|| preg_match( '/\bvacancy\s+(?:at|in|for|with)\b|\bvacancies\s+(?:at|in|for|with)\b.{0,80}\b(?:apply|recruitment|notification|last\s+date)\b|\brecruitment\s+20\d\d\b|\b(?:apply|applications?)\s+(?:online|offline|now|invited)\b|\bwalk[- ]in\s+interview\b|\b(?:job|career)\s+(?:opening|openings|alert|notification|vacancy)\b|\bnow\s+hiring\b|\bis\s+hiring\b/i', $title ) ) {
			return 'a job vacancy, not a news report (jobs come from the opportunity sources)';
		}
		return $reason;
	},
	10,
	4
);
