import { Component } from '@angular/core';
import { ClientesService } from 'src/app/service/clientes.service';
import { FacturasService } from 'src/app/service/facturas.service';
@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class ListaFacturacionComponent {

  facturas: any ; 
  facturasBalance: any ; 
  personaEditar: any;
  facturasFiltradas: any;
  modoOculto: boolean = true;
  constructor(private facturasService: FacturasService) {
  }
  ngOnInit() {
   this.getData();
  }
  
  getData(){
    this.facturasService.getFacturacion().subscribe(data => {
      this.facturas = data;
      this.facturasFiltradas = data;
      
    })
  }
  
  eliminarPorId(id: number) {
    console.log(id)
    this.facturasService.eliminarPorId(id).subscribe(
      (response) => {
      console.log('Persona eliminada correctamente');
      this.getData();
    }, error => {
      console.error('Error al eliminar persona:', error);
    });
  }
  buscar(texto: Event) {
    const input = texto.target as HTMLInputElement;
    console.log(this.facturasFiltradas)
    this.facturasFiltradas = this.facturas.filter( (factura: any) =>
      factura.nitCliente.toString().includes(input.value) ||
      factura.nombreCliente.toString().includes(input.value)
    );
  }



}
