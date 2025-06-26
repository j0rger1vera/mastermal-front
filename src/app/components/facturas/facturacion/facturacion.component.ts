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

      this.facturasFiltradas.sort((a: any, b: any) => {
            if (a.nombreCliente < b.nombreCliente) {
                return -1; // a va antes que b
            }
            if (a.nombreCliente > b.nombreCliente) {
                return 1; // b va antes que a
            }
            return 0; // son iguales
        });

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
    const inputLowerCase = input.value.toLowerCase();
    console.log(this.facturasFiltradas)
    this.facturasFiltradas = this.facturas.filter( (factura: any) =>
      factura.nitCliente.toString().includes(input.value) ||
      factura.nombreCliente.toString().includes(inputLowerCase)
    );
  }



}
