import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  type!: string | null;

  ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    console.log(this.type);
  }
}
