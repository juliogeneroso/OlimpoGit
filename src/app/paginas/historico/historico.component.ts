import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, UnsubscriptionError } from 'rxjs';
import { ConexaoService } from '../../service/conexao.service';
import { ControleEntradaSaida, ControleEntregasConcluidas, EntregaPendenteCadastrada } from '../../service/conexao.model';
import { PageEvent } from '@angular/material/paginator';
import { SalvoComponent } from '../../avisos/salvo/salvo.component';
import { ErroComponent } from '../../avisos/erro/erro.component';
import  {MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';

interface Tipo {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit,OnDestroy {

 

  constructor(private conexaoService:ConexaoService,private snackBar: MatSnackBar,private formBuilder: FormBuilder) { }

  durationInSeconds = 5;

  public controlePessoasEntrada = new Array<ControleEntradaSaida>();
  public controlePessoasSaida = new Array<ControleEntradaSaida>();
  public controleEntregasPendentes = new Array<EntregaPendenteCadastrada>();
  public controleEntregasConcluidas =  new Array<ControleEntregasConcluidas>();
  
  public paginacaoPessoasEntrada;
  public paginacaoPessoasSaida;
  public paginacaoEntregasPendentes;
  public paginacaoEntregasConcluidas;

  public variavel;
  private historico;

  tipos: Tipo[] = [
    {value: '0', viewValue: 'Entradas'},
    {value: '1', viewValue: 'Saidas'},
    {value: '2', viewValue: 'Entregas Pendentes'},
    {value: '3', viewValue: 'Entregas Realizadas'},
  ];

  selectedTipo = this.tipos[0].viewValue;

  checkoutForm = this.formBuilder.group({
    bloco:'',
    num:''
  });
  

  ngOnInit(): void {
    this.ionViewDidEnter();
    this.variavel="Entradas";
  }

  ionViewDidEnter(){ 
     this.historico = this.conexaoService.getEntrada().subscribe(
      data => {
        const response = (data as any);
        this.controlePessoasEntrada = response;
        this.paginacaoPessoasEntrada = this.controlePessoasEntrada.slice(0,20);
      },
      error =>{
        console.log('ERROR');
      }
    );
  }

  selecionar(tipo){
    if(tipo==="Entradas"){
      this.historicoEntrada();
    }if(tipo==="Saidas"){
      this.historicoSaida();
    }if(tipo==="Entregas Pendentes"){
      this.entregasPendentes();
    }if(tipo==="Entregas Realizadas"){
      this.entregasRealizadas();
    }

    this.variavel = tipo;
  } 

  historicoEntrada(){
    this.controlePessoasEntrada=[];
    this.historico = this.conexaoService.getEntrada().subscribe(
      data => {
        const response = (data as any);
        this.controlePessoasEntrada = response;
        this.paginacaoPessoasEntrada = this.controlePessoasEntrada.slice(0,19);
      },
      error =>{
        console.log('ERROR');
      }
    );
  }

  historicoSaida(){
    this.controlePessoasSaida=[];
    this.historico = this.conexaoService.getSaida().subscribe(
      data => {
        const response = (data as any);
        this.controlePessoasSaida = response;
        this.paginacaoPessoasSaida = this.controlePessoasSaida.slice(0,19);
      },
      error =>{
        console.log('ERROR');
      }
    );
  }

  entregasPendentes(){
    this.controleEntregasPendentes=[];
    this.historico = this.conexaoService.getEntregasPendentes().subscribe(
      data => {
        const response = (data as any);
        this.controleEntregasPendentes = response;
        this.paginacaoEntregasPendentes = this.controleEntregasPendentes.slice(0,19);
      },
      error =>{
        console.log('ERROR');
      }
    );
  }

  entregasRealizadas(){
    this.controleEntregasConcluidas=[];
    this.historico = this.conexaoService.getEntregasConcluidas().subscribe(
      data => {
        const response = (data as any);
        this.controleEntregasConcluidas = response;
        //console.log(this.controleEntregasConcluidas);
        this.paginacaoEntregasConcluidas = this.controleEntregasConcluidas.slice(0,19);
      },
      error =>{
        console.log('ERROR');
      }
    );
  }

  entregar(pendentes){
    console.log(pendentes);
    let indice = this.controleEntregasPendentes.indexOf(pendentes);
    //Remove a entrega no banco de dados. pendentes valores em um array: {viewValue:'',bloco:'',num:,obs:''} //lembrando que num é do tipo number
    this.conexaoService.entregasConcluidas(pendentes).then(()=> {
      while(indice>=0){
        this.controleEntregasPendentes.splice(indice,1);
        indice = this.controleEntregasPendentes.indexOf(pendentes);
      }
    })
    .then(()=>{
      this.reOrganizar();
      this.salvoSucesso();
    })
    .catch(()=>{
      this.erroConcluirPedido();
    });
    
    //Remove o item da lista de Entregas Pendentes.
   
  }

  reOrganizar(){
    this.paginacaoEntregasPendentes = this.controleEntregasPendentes.slice(0,19);
  }

  onPageChange(event:PageEvent, paginaSelecionada){
    if(paginaSelecionada == "Entradas"){

      const startIndex = event.pageIndex * event.pageSize;
      let endIndex = startIndex + event.pageSize;

        if( endIndex > this.controlePessoasEntrada.length){
          endIndex = this.controlePessoasEntrada.length;
        }
        this.paginacaoPessoasEntrada = this.controlePessoasEntrada.slice(startIndex, endIndex);
    }
    if(paginaSelecionada == "Saidas"){

      const startIndex = event.pageIndex * event.pageSize;
      let endIndex = startIndex + event.pageSize;
      
        if( endIndex > this.controlePessoasSaida.length){
          endIndex = this.controlePessoasSaida.length;
        }
        this.paginacaoPessoasSaida = this.controlePessoasSaida.slice(startIndex, endIndex);
    }

    if(paginaSelecionada == "Entregas Pendentes"){
      const startIndex = event.pageIndex * event.pageSize;
      let endIndex = startIndex + event.pageSize;
      
        if( endIndex > this.controleEntregasPendentes.length){
          endIndex = this.controleEntregasPendentes.length;
        }
        this.paginacaoEntregasPendentes = this.controleEntregasPendentes.slice(startIndex, endIndex);
    }

    if(paginaSelecionada == "Entregas Realizadas"){
      const startIndex = event.pageIndex * event.pageSize;
      let endIndex = startIndex + event.pageSize;
      
        if( endIndex > this.controleEntregasConcluidas.length){
          endIndex = this.controleEntregasConcluidas.length;
        }
        this.paginacaoEntregasConcluidas = this.controleEntregasConcluidas.slice(startIndex, endIndex);
    }
  }

  consulta(){
    if(this.variavel==="Entradas"){
      this.controlePessoasEntrada=[];
      this.historico = this.conexaoService.consultaEntradaBlocoNum(this.checkoutForm).subscribe(
      data => {
        const response = (data as any);
        this.controlePessoasEntrada = response;
        this.paginacaoPessoasEntrada = this.controlePessoasEntrada.slice(0,19);
      },
      error =>{
        console.log('ERROR');
      }
    );
    }if(this.variavel==="Saidas"){
      this.controlePessoasSaida=[];
      this.historico = this.conexaoService.consultaSaidaBlocoNum(this.checkoutForm).subscribe(
      data => {
        const response = (data as any);
        this.controlePessoasSaida = response;
        this.paginacaoPessoasSaida = this.controlePessoasSaida.slice(0,19);
      },
      error =>{
        console.log('ERROR');
      }
    );
    }if(this.variavel==="Entregas Pendentes"){
      this.controleEntregasPendentes=[];
      this.historico = this.conexaoService.consultaEntregasPendentes(this.checkoutForm).subscribe(
      data => {
        const response = (data as any);
        this.controleEntregasPendentes = response;
        this.paginacaoEntregasPendentes = this.controleEntregasPendentes.slice(0,19);
      },
      error =>{
        console.log('ERROR');
      }
    );
    }if(this.variavel==="Entregas Realizadas"){
      this.controleEntregasConcluidas=[];
      this.historico = this.conexaoService.consultaEntregasConcluidas(this.checkoutForm).subscribe(
      data => {
        const response = (data as any);
        this.controleEntregasConcluidas = response;
        //console.log(this.controleEntregasConcluidas);
        this.paginacaoEntregasConcluidas = this.controleEntregasConcluidas.slice(0,19);
      },
      error =>{
        console.log('ERROR');
      }
    );
    }else{
      this.controlePessoasEntrada=[];
      this.historico = this.conexaoService.consultaEntradaBlocoNum(this.checkoutForm).subscribe(
      data => {
        const response = (data as any);
        this.controlePessoasEntrada = response;
        this.paginacaoPessoasEntrada = this.controlePessoasEntrada.slice(0,19);
      },
      error =>{
        console.log('ERROR');
      }
    );
    }
  }

  removerFiltro(){
    this.checkoutForm.reset();
    if(this.variavel==="Entradas"){
      this.historicoEntrada();
    }if(this.variavel==="Saidas"){
      this.historicoSaida();
    }if(this.variavel==="Entregas Pendentes"){
      this.entregasPendentes();
    }if(this.variavel==="Entregas Realizadas"){
      this.entregasRealizadas();
    }
  }

  salvoSucesso() {
    this.snackBar.openFromComponent(SalvoComponent, {
      duration: this.durationInSeconds * 500,
    });
  }

  erroConcluirPedido() {
    this.snackBar.openFromComponent(ErroComponent, {
      duration: this.durationInSeconds * 500,
    });
  }

  ngOnDestroy(){
    this.historico.unsubscribe();
  }
}
