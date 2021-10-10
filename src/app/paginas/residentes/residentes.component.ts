import {  Component, OnInit, OnDestroy } from '@angular/core';
import { Cadastro, ResidentesItem } from '../../service/conexao.model';
import { ConexaoService } from '../../service/conexao.service';
import { DeletadoComponent } from '../../avisos/deletado/deletado.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlteradoComponent } from '../../avisos/alterado/alterado.component';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-residentes',
  templateUrl: './residentes.component.html',
  styleUrls: ['./residentes.component.css']
})
export class ResidentesComponent implements OnInit,OnDestroy {
 

  constructor(private conexao:ConexaoService, private snackBar:MatSnackBar,private router:Router){}

  
  panelOpenState = false;
  private historico;
  public input:boolean;
  public moradores = new Array<ResidentesItem>();
  public paginacaoMoradores;
  durationInSeconds = 5;

  ngOnInit() {
    this.ionViewDidEnter();
  }

  openSnackBarDeletado() {
    this.snackBar.openFromComponent(DeletadoComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
  openSnackBarAlterado() {
    this.snackBar.openFromComponent(AlteradoComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  alterar(alterar:ResidentesItem){
    let id = alterar.id;
  
    //let ramal = alterar.ramal;

    this.router.navigate([`/alterar`, id]);
  }

  excluir(exclusao){
   // console.log(exclusao.id);
    let indice = this.moradores.indexOf(exclusao);
    this.conexao.deletarResidente(exclusao.id);
    while(indice>=0){
      this.moradores.splice(indice,1);
      indice = this.moradores.indexOf(exclusao);
    }
    this.reOrganizar();
    this.openSnackBarDeletado();
  }

  reOrganizar(){
    this.paginacaoMoradores = this.paginacaoMoradores = this.moradores.slice(0,20);
  }

  ionViewDidEnter(){
    this.historico = this.conexao.getMoradores().subscribe(
      data => {
        const response = (data as any);
        this.moradores = response;
        //console.log(this.moradores);
        this.paginacaoMoradores = this.moradores.slice(0,20);
        //console.log(this.paginacaoMoradores);
      }, erro => {
          console.log("deu errado aqui");
      } 
    )
  }
  onPageChange(event:PageEvent){

      const startIndex = event.pageIndex * event.pageSize;
      let endIndex = startIndex + event.pageSize;

        if( endIndex > this.moradores.length){
          endIndex = this.moradores.length;
        }
        this.paginacaoMoradores = this.moradores.slice(startIndex, endIndex);
    }
  ngOnDestroy(){
    this.historico.unsubscribe();
  }
}
