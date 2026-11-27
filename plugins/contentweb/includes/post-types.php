<?php
defined('ABSPATH') || exit;
add_action('init', function(){
 register_post_type('case_study', array('labels'=>array('name'=>'Case Studies','singular_name'=>'Case Study','add_new'=>'Add Case Study','add_new_item'=>'Add Case Study','edit_item'=>'Edit Case Study','new_item'=>'New Case Study','view_item'=>'View Case Study','view_items'=>'View Case Studies','search_items'=>'Search Case Studies','not_found'=>'No case studies found','not_found_in_trash'=>'No case studies found in Trash','all_items'=>'All Case Studies','archives'=>'Case Study Archives','menu_name'=>'Case Studies'),'public'=>true,'has_archive'=>true,'rewrite'=>array('slug'=>'work','with_front'=>false),'show_in_rest'=>true,'supports'=>array('title','editor','excerpt','thumbnail','author')));
 register_taxonomy('discipline','case_study',array('label'=>'Discipline','public'=>true,'show_in_rest'=>true,'rewrite'=>array('slug'=>'discipline')));
 register_taxonomy('industry','case_study',array('label'=>'Industry','public'=>true,'show_in_rest'=>true,'rewrite'=>array('slug'=>'industry')));
});
