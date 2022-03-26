import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GalleryTabPage } from './gallery-tab.page';

describe('GalleryTabPage', () => {
  let component: GalleryTabPage;
  let fixture: ComponentFixture<GalleryTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GalleryTabPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
