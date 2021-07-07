import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SalvoComponent } from '../avisos/salvo/salvo.component';
import { ConexaoService } from '../service/conexao.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ErroComponent } from '../avisos/erro/erro.component';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,private conexao:ConexaoService,private snackBar: MatSnackBar) { }

  durationInSeconds = 5;
  imagePath = "/assets/load.gif";
  carregando:boolean = false;


  ngOnInit(): void {
  }

  CadastroForm = this.formBuilder.group({
    nomeCompleto: '',
    bloco:'',
    casa: '',
    ramal: ''
  });

  openSnackBar() {
    this.snackBar.openFromComponent(SalvoComponent, {
      duration: this.durationInSeconds * 500,
    });
  }
  ErroSnackBar() {
    this.carregando = false;
    this.snackBar.openFromComponent(ErroComponent, {
      duration: this.durationInSeconds * 500,
    });
  }
  onSubmitCadastro(){
    this.carregando = true;
    this.CadastroForm.value.bloco = this.CadastroForm.value.bloco.toUpperCase(); 

    this.conexao.cadastro(this.CadastroForm).then(()=>{
    this.openSnackBar();
    this.carregando = false;
    }).then(()=>{
    this.CadastroForm.reset();
    }).catch(()=>{
    this.ErroSnackBar();
    });
   
   
  }
}
