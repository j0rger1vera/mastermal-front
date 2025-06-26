import { Component } from '@angular/core';
import { FacturasService } from 'src/app/service/facturas.service';
@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.component.html',
  styleUrls: ['./lista-facturas.component.css']
})
export class ListaFacturasComponent {

  nombreMinuscula: any;
  filtroNombreMinuscula: any;
  facturas: any ;
  facturaEditar: any;
  facturasFiltradas: any;
  tFacturado: number = 0;
  tAbonado: number = 0;
  tSaldo: number = 0;
  modoOculto: boolean = true;
  constructor(private facturasService: FacturasService) {
  }
  ngOnInit() {
   this.getData();
  }
  
  getData(){
    this.facturasService.getData().subscribe(data => {
      this.facturas = data;
      this.facturasFiltradas = data;
        this.tAbonado =0;
         this.tSaldo =0;
         this.tFacturado =0;
      this.facturasFiltradas.forEach((factura: { abono: any; saldo: any; total: any; }) => {

            this.tAbonado = this.tAbonado +factura.abono || 0;
            this.tSaldo = this.tSaldo + factura.saldo || 0;
            this.tFacturado = this.tFacturado + factura.total || 0;
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
      factura.numeroFactura.toString().includes(input.value)
      || factura.nombreCliente.toString().includes(inputLowerCase)
    );
         this.tAbonado =0;
         this.tSaldo =0;
         this.tFacturado =0;
      this.facturasFiltradas.forEach((factura: { abono: any; saldo: any; total: any; }) => {
        this.sumatoriaTotales(this.tAbonado,this.tSaldo,this.tFacturado,factura);
        });
  }

  filterTable(texto: Event) {
    const input = texto.target as HTMLInputElement;
    console.log(this.facturasFiltradas)
    this.facturasFiltradas = this.facturas.filter( (factura: any) =>
      factura.fechaFacturada.toString().includes(input.value)
    );
         this.tAbonado =0;
         this.tSaldo =0;
         this.tFacturado =0;
      this.facturasFiltradas.forEach((factura: { abono: any; saldo: any; total: any; }) => {
        this.sumatoriaTotales(this.tAbonado,this.tSaldo,this.tFacturado,factura);
        });
  }

  toggleModoEdicion(factura: any) {
    this.facturaEditar = factura;
    this.editarModoOcuto()
    console.log("factura a editar *", this.facturaEditar);
  }
  
  editarModoOcuto(){
    this.modoOculto = !this.modoOculto;
    this.getData();
  }

  sumatoriaTotales(tAbonado: any, tSaldo: any, tFacturado: any, factura: any) {
    this.tAbonado = this.tAbonado + factura.abono || 0;
            this.tSaldo = this.tSaldo + factura.saldo || 0;
            this.tFacturado = this.tFacturado + factura.total || 0;

  }
}
