import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PieceService } from '../services/piece';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-dashb',
  templateUrl: './client-dashb.html',
  styleUrl: './client-dashb.scss',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ClientDashb {

  pieces: any[] = [];

  constructor(
    private pieceService: PieceService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPieces();
  }

  loadPieces() {
    this.pieceService.getPieces().subscribe(data => {
      this.pieces = data.map(p => ({ ...p, showMenu: false }));
      this.cd.detectChanges();
    });
  }

  goToAddEquipement(pieceId: number) {
    this.router.navigate(['/equipement', pieceId]);
  }

  goToCondition(equip: any) {
    const nom = equip.nom?.toLowerCase() || '';
    const desc = equip.description?.toLowerCase() || '';

    let type = 'lampe';

    if (nom.includes('chauf') || desc.includes('chauf')) {
      type = 'chauffage';
    } else if (nom.includes('clim') || desc.includes('clim')) {
      type = 'clime';
    } else if (nom.includes('tv') || nom.includes('telev') || desc.includes('telev')) {
      type = 'television';
    } else if (nom.includes('lamp') || desc.includes('lamp')) {
      type = 'lampe';
    }

    this.router.navigate(['/condition'], {
      queryParams: {
        id: equip.id,
        nom: equip.nom,
        type: type
      }
    });
  }

  deletePiece(id: number) {
    if (confirm("Voulez-vous vraiment supprimer cette pièce ?")) {
      this.pieceService.deletePiece(id).subscribe(() => {
        this.loadPieces();
        this.cd.detectChanges();
      });
    }
  }

  deleteEquip(id: number) {
    if (confirm("Voulez-vous supprimer cet équipement ?")) {
      this.pieceService.deleteEquipement(id).subscribe(() => {
        this.loadPieces();
        this.cd.detectChanges();
      });
    }
  }

  toggleEquip(equip: any) {}
}