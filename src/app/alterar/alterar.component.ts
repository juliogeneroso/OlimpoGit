import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SalvoComponent } from '../avisos/salvo/salvo.component';
import { ConexaoService } from '../service/conexao.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ResidentesItem } from '../service/conexao.model';
import { AlteradoComponent } from '../avisos/alterado/alterado.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.component.html',
  styleUrls: ['./alterar.component.css']
})
export class AlterarComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,private conexao:ConexaoService,private snackBar: MatSnackBar,private rota:ActivatedRoute,private router:Router) { }

  private id;
  public nome;
  public bloco;
  public casa;
  public ramal;

  public dadosResidentes:ResidentesItem;

  ngOnInit(): void {
    this.rota.params.subscribe(params => this.id = params['id']);
    this.rota.params.subscribe(params => this.nome = params['nome']);
    this.rota.params.subscribe(params => this.bloco = params['bloco']);
    this.rota.params.subscribe(params => this.casa = params['casa']);
    this.rota.params.subscribe(params => this.ramal = params['ramal']);
  }

  durationInSeconds = 5;

  AlterarForm = this.formBuilder.group({
    id: '',
    nome: '',
    bloco:'',
    casa: '',
    ramal: ''
  });

  openSnackBar() {
    this.snackBar.openFromComponent(AlteradoComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
  onSubmitCadastro(){
    this.AlterarForm.value.bloco = this.AlterarForm.value.bloco.toUpperCase(); 
    this.AlterarForm.value.id = this.id;
    this.conexao.editar(this.AlterarForm.value);
    this.AlterarForm.reset();
    this.openSnackBar();
    this.router.navigate([`/entrada_saida`]);
  }
}
