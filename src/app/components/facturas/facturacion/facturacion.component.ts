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
  facturasPorNit: any;
  abonoValue: any;
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

  onEnter(factura: any, abonoInput: HTMLInputElement) {
    const abono = abonoInput.value;
    if (abono) {
      this.abonoValue = parseFloat(abono);
      if (!isNaN(this.abonoValue) && this.abonoValue > 0) {
        factura.abono = factura.abono + this.abonoValue;
        factura.saldo = factura.saldo - this.abonoValue;
        console.log('Abono actualizado:', factura);
        
        abonoInput.value = '';

        this.facturasService.getFacturacionPorClienteId(factura.rucCliente).subscribe(data => {
          this.facturasPorNit = data;

            // Recorrer la lista de facturas y actualizar cada una
                this.facturasPorNit.forEach((facturaPorNit: any) => {
                    // Solo actualizar si abonoValue es mayor que cero
                    if (this.abonoValue > 0) {//75000
                        // Actualizar la factura
                            
                            if (this.abonoValue > facturaPorNit.saldo) { 
                              this.abonoValue = this.abonoValue - facturaPorNit.saldo; // 67500                            
                              facturaPorNit.abono = facturaPorNit.saldo;
                            } else {
                              facturaPorNit.abono = this.abonoValue;
                            }
                            facturaPorNit.saldo = facturaPorNit.abono - facturaPorNit.saldo;

                            // Si el abonoValue llega a cero, se puede salir del ciclo
                            if (this.abonoValue <= 0) {
                                console.log('Todos los abonos procesados.');
                            }

                        this.facturasService.actualizar(facturaPorNit).subscribe(response => {
                            console.log('Datos enviados correctamente:', response);
                        }, error => {
                            console.error('Error al enviar datos:', error);
                            alert('Error al enviar datos: los campos no cumplen con los formatos requeridos');
                        });
                    }
                });

                // Al final, si se quiere mostrar un mensaje de éxito
                if (this.abonoValue <= 0) {
                    alert('Todos los datos registrados correctamente');
                }
          });

      } else {
        console.error('El valor ingresado no es un número válido');
      }
    } else {
      console.error('No se ingresó ningún valor');
    }
  }

}
