import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacturasService } from 'src/app/service/facturas.service';
import { cantidadMayorQueCero, soloTexto, validarDecimalConDosDecimales } from 'src/app/validators/validatorFn';

@Component({
  selector: 'app-editarfactura',
  templateUrl: './editar-factura.component.html',
  styleUrls: ['./editar-factura.component.css']
})
export class EditarFacturaComponent {

  
  @Input() facturaEditar: any = {};
  @Output() modoOculto = new EventEmitter();
  facturaForm: FormGroup;

  abono: number = 0;
  saldo: number = 0;
  total: number = 0;

  constructor(private fb: FormBuilder, private facturaService: FacturasService) {
    this.facturaForm = this.fb.group({
      idFactura: [],
      numeroFactura: [],
      nombreCliente: ['', [Validators.required, soloTexto()]],
      nitCliente: [],
      total  : ['', [Validators.required]],
      saldo: ['', [Validators.required]],
      abono: ['', [Validators.required]],

    });

    console.log("constructor");
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['facturaEditar'] && this.facturaEditar) {
      this.facturaForm.patchValue(this.facturaEditar);
    }
    console.log("onchange");
  }
  

  editar(): void {

    const valoresFormulario = this.facturaForm.value;
    console.log("Factura ", this.facturaEditar?.nombre);
    console.log("Factura editada", valoresFormulario);
    
    if (this.facturaForm.valid) {
      
      console.log('El formulario es válido. Enviar solicitud...');
    } else {
      
      Object.values(this.facturaForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    
    this.facturaService.actualizar(valoresFormulario).subscribe(
      response => {
        console.log('Factura editada correctamente:', response);
        alert('Factura editada correctamente');
        // window.location.reload();
        this.modoOculto.emit();
      },
      error => {
        console.error('Error al editar factura:', error);
        alert('Error al editar factura: los campos no cumplen con los formatos requeridos');	
      }
    )
  }

  calcularSaldo(efecti: any){
    this.abono =  efecti.value;
    this.facturaForm.get('saldo')?.setValue(this.facturaEditar.total - efecti.value);
  }

}