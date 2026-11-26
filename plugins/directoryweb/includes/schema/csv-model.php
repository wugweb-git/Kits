<?php
/**
 * Listing CSV (pure): build and read a CSV whose columns are a listing type's field keys. One header row, UTF-8, commas,
 * double quotes. Cells that start with = + - or @ are written with a leading apostrophe so a spreadsheet does not run
 * them as formulas, and the apostrophe is taken off again on import.
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The most rows one import reads. */
const DIRECTORYWEB_CSV_MAX_ROWS = 500;

/**
 * One cell, safe to write.
 *
 * @param mixed $v Value.
 */
function directoryweb_csv_cell( $v ): string {
	$v = is_array( $v ) ? implode( ', ', array_map( 'strval', $v ) ) : (string) $v;
	$v = str_replace( array( "\r\n", "\r" ), "\n", $v );
	if ( '' !== $v && in_array( $v[0], array( '=', '+', '-', '@', "\t" ), true ) ) {
		$v = "'" . $v;
	}
	return ( preg_match( '/[",\n]/', $v ) ) ? '"' . str_replace( '"', '""', $v ) . '"' : $v;
}

/**
 * A CSV from a header and rows.
 *
 * @param string[] $header Column keys.
 * @param array[]  $rows   Each: key => value.
 */
function directoryweb_csv_build( array $header, array $rows ): string {
	$out = implode( ',', array_map( 'directoryweb_csv_cell', $header ) ) . "\r\n";
	foreach ( $rows as $r ) {
		$line = array();
		foreach ( $header as $k ) {
			$line[] = directoryweb_csv_cell( $r[ $k ] ?? '' );
		}
		$out .= implode( ',', $line ) . "\r\n";
	}
	return $out;
}

/**
 * Reads CSV text into rows of cells (a quoted cell may hold commas, quotes and line breaks).
 *
 * @param string $text CSV.
 * @return string[][] Rows; blank lines are skipped.
 */
function directoryweb_csv_rows( string $text ): array {
	$text = preg_replace( '/^\xEF\xBB\xBF/', '', $text );
	$rows = array();
	$row  = array();
	$cell = '';
	$q    = false;
	$n    = strlen( $text );
	for ( $i = 0; $i < $n; $i++ ) {
		$c = $text[ $i ];
		if ( $q ) {
			if ( '"' === $c ) {
				if ( $i + 1 < $n && '"' === $text[ $i + 1 ] ) {
					$cell .= '"';
					++$i;
				} else {
					$q = false;
				}
			} else {
				$cell .= $c;
			}
			continue;
		}
		if ( '"' === $c && '' === $cell ) {
			$q = true;
		} elseif ( ',' === $c ) {
			$row[] = $cell;
			$cell  = '';
		} elseif ( "\n" === $c || "\r" === $c ) {
			if ( "\r" === $c && $i + 1 < $n && "\n" === $text[ $i + 1 ] ) {
				++$i;
			}
			$row[] = $cell;
			if ( array( '' ) !== $row ) {
				$rows[] = $row;
			}
			$row  = array();
			$cell = '';
		} else {
			$cell .= $c;
		}
	}
	if ( '' !== $cell || $row ) {
		$row[] = $cell;
		$rows[] = $row;
	}
	return $rows;
}

/**
 * The listings in a CSV, as canonical values. Columns that are not fields of the type are reported, not used; a
 * multiselect cell is split on commas.
 *
 * @param string $text   CSV.
 * @param array  $fields key => field of the listing type.
 * @return array{rows:array[],ignored:string[],error:string} rows: [ row number => values ].
 */
function directoryweb_csv_listings( string $text, array $fields ): array {
	$all = directoryweb_csv_rows( $text );
	if ( ! $all ) {
		return array( 'rows' => array(), 'ignored' => array(), 'error' => 'The file is empty.' );
	}
	$header  = array_map( static fn( $h ) => strtolower( trim( $h ) ), array_shift( $all ) );
	$ignored = array();
	foreach ( $header as $h ) {
		if ( '' !== $h && ! isset( $fields[ $h ] ) ) {
			$ignored[] = $h;
		}
	}
	if ( ! array_intersect( $header, array_keys( $fields ) ) ) {
		return array( 'rows' => array(), 'ignored' => $ignored, 'error' => 'No column matches a field of this listing type.' );
	}
	if ( count( $all ) > DIRECTORYWEB_CSV_MAX_ROWS ) {
		return array( 'rows' => array(), 'ignored' => $ignored, 'error' => 'At most ' . DIRECTORYWEB_CSV_MAX_ROWS . ' rows at a time.' );
	}
	$rows = array();
	foreach ( $all as $i => $cells ) {
		$values = array();
		foreach ( $header as $col => $key ) {
			if ( ! isset( $fields[ $key ] ) || ! isset( $cells[ $col ] ) ) {
				continue;
			}
			$v = $cells[ $col ];
			if ( preg_match( "/^'[=+\-@\t]/", $v ) ) {
				$v = substr( $v, 1 );
			}
			if ( 'multiselect' === $fields[ $key ]['type'] ) {
				$v = array_values( array_filter( array_map( 'trim', explode( ',', $v ) ), 'strlen' ) );
			}
			$values[ $key ] = $v;
		}
		$rows[ $i + 1 ] = $values; // the row's number after the header (blank lines do not count)
	}
	return array( 'rows' => $rows, 'ignored' => $ignored, 'error' => '' );
}
