import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VisitService } from '../services/visit.service';

@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.page.html',
  styleUrls: ['./visit-details.page.scss'],
})
export class VisitDetailsPage implements OnInit {

  id: any; visitdetails: any = [];
  constructor(private router: ActivatedRoute, private visitservice: VisitService) { }

  ngOnInit() {
    this.id = this.router.snapshot.paramMap.get('id');
    this.getVisitDetailsByLocCustId();
  }

  getVisitDetailsByLocCustId() {
    return this.visitservice.getVisitDetailsByLocCustId(this.id).subscribe(result => {
      this.visitdetails = result[0];
      console.log(result);
    });
  }

}
