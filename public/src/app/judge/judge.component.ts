import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';
import { CountdownService } from '../countdown.service';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.css']
})
export class JudgeComponent implements OnInit {
  
  hackathon: object;
  hackathonId: number;
  paramSub: Subscription;
  projects = [];
  judgeForm: FormGroup;
  scores = [];
  
  
  constructor(private fb: FormBuilder, private httpService: HttpService, private _router: Router, private _route: ActivatedRoute, private count: CountdownService) {}

  ngOnInit() {
    this.paramSub = this._route.params.subscribe(param => {
      this.hackathonId = param.id;
      this.getProjects();
      this.getHackathon();
    })

    this.judgeForm = this.fb.group({
      scores: this.fb.array([])
    })
  }
  initTeam(project){
    return this.fb.group({
      teamName: [project.teamName+"", []],
      projectId: [project.id+"", []],
      projectTitle: [project.title+"", []],
      ui: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      presentation: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      idea: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      implementation:  ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      extra:  ['0', [Validators.required, Validators.min(0), Validators.max(5)]],
      comment:  ['', []],
    })
  }

  generateTeamsForm(){
    var control = <FormArray>this.judgeForm.controls['scores'];
    for(let project of this.projects){
     
      control.push(this.initTeam(project));
    }
   
  }

  submitScores(){
   
    const model = this.judgeForm.value;
    if(this.judgeForm.status == "VALID"){
      
      this.httpService.postObs('/admin/score', model).subscribe(
        data => {
          if(this.count.previousUrl){

            this._router.navigate([this.count.previousUrl])
          }
          else {
            this._router.navigate(['/details', this.hackathonId, 'admin'])
          }
  
        },
        err => console.log("failure scoring", err)
      )
    }
    
  }
  cancel(){
    this.judgeForm.reset();
    this._router.navigate(['/details', this.hackathonId, 'admin'])
  }

  getProjects(){
    this.httpService.getObs(`/hackathons/${this.hackathonId}/allprojects`).subscribe(
      body => {
        
        this.projects = body["projects"]
        this.generateTeamsForm();
      },
      err => {
        console.log("Got the error on admin details", err)
      }
    ) 
  }

  getHackathon(){
    this.httpService.getObs(`/hackathons/any/${this.hackathonId}`).subscribe(
      data => {
       
        this.hackathon = data["hackathon"];
      },
      err => console.log("Got an error fetching a hackathon", err)
    )
  }
}
