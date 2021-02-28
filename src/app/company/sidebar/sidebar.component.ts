import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('.tree_widget-sec > ul > li.inner-child:first > ul').slideDown();
    $('.tree_widget-sec > ul > li.inner-child:first').addClass('active');
    $('.tree_widget-sec > ul > li.inner-child > a').on('click', function(){
      $('.tree_widget-sec > ul > li.inner-child').removeClass('active');
      $('.tree_widget-sec > ul > li > ul').slideUp();
      $(this).parent().addClass('active');
      $(this).next('ul').slideDown();
      return false;
    });
  }

}
