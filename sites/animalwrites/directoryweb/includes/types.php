<?php
/**
 * The Animal Writes listing vocabulary (moved out of DirectoryWeb 1.3.0 unchanged): the veterinary types that are one filter,
 * the services list, the services a type implies, and the two services that are also listing types.
 *
 * @package animalwrites-directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** "Veterinary" is one filter for people; the listings keep their separate veterinary types. Bird Hospital is its own
 * choice (owner, 18 Oct 2026). */
const AW_VET_TYPES = array( 'veterinary-hospital', 'veterinary-dispensary', 'veterinary-clinic', 'mobile-veterinary-unit', 'veterinary-office' );

add_filter(
	'directoryweb_type_groups',
	function ( $groups ) {
		$groups['veterinary'] = array( 'name' => 'Veterinary', 'types' => AW_VET_TYPES );
		return $groups;
	}
);

/**
 * The services a listing can offer: slug => name. The same list as Core's AW_SERVICES (model.php). "wildlife-rescue"
 * and "emergency-rescue" are also listing types, and count as types (directoryweb_service_slugs()).
 */
const DIRECTORYWEB_SERVICES = array(
	'rescue'           => 'Rescue Work',
	'treatment'        => 'Treatment and Vet Care',
	'shelter'          => 'Sheltering',
	'adoption'         => 'Adoption Service',
	'feeding'          => 'Feeding',
	'sterilisation'    => 'Sterilisation (ABC)',
	'vaccination'      => 'Vaccination',
	'ambulance'        => 'Ambulance Service',
	'boarding-foster'  => 'Boarding and Fostering',
	'wildlife-rescue'  => 'Wildlife Rescue',
	'legal-help'       => 'Legal Help',
	'cattle-care'      => 'Cattle Care',
	'animal-welfare'   => 'Animal Welfare',
	'bird-treatment'   => 'Bird Treatment',
	'emergency-rescue' => 'Emergency Rescue',
);;

add_filter( 'directoryweb_services', fn() => DIRECTORYWEB_SERVICES );
add_filter( 'directoryweb_service_type_slugs', fn() => array( 'wildlife-rescue', 'emergency-rescue' ) );

/**
 * Services implied by a listing's type (owner, 20 Oct 2026; Notion "Page templates: items and listings" §3): shown,
 * marked "Based on type", only when the listing states no services. Type slug => service tag slugs.
 */
const AW_TYPE_SERVICES = array(
	'animal-welfare-organisation' => array( 'animal-welfare' ),
	'animal-shelter'              => array( 'shelter' ),
	'rescue-group'                => array( 'rescue' ),
	'emergency-rescue'            => array( 'emergency-rescue' ),
	'animal-ambulance'            => array( 'ambulance' ),
	'abc-centre'                  => array( 'sterilisation' ),
	'gaushala'                    => array( 'cattle-care', 'shelter' ),
	'sanctuary'                   => array( 'shelter' ),
	'wildlife-rescue'             => array( 'wildlife-rescue' ),
	'bird-hospital'               => array( 'bird-treatment' ),
	'veterinary-hospital'         => array( 'treatment', 'vaccination', 'sterilisation' ),
	'veterinary-dispensary'       => array( 'treatment', 'vaccination' ),
	'veterinary-clinic'           => array( 'treatment', 'vaccination' ),
	'veterinary-office'           => array( 'vaccination' ),
	'mobile-veterinary-unit'      => array( 'treatment', 'ambulance' ),
	'legal-aid'                   => array( 'legal-help' ),
	'adoption-network'            => array( 'adoption' ),
	'feeder-network'              => array( 'feeding' ),
);;

add_filter( 'directoryweb_type_services', fn() => AW_TYPE_SERVICES );
