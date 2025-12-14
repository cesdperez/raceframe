import { jsPDF } from 'jspdf';
import {
	BLEED_MM,
	CROP_MARK_LENGTH_MM,
	CROP_MARK_OFFSET_MM,
	MM_PER_INCH
} from '$lib/constants/poster';
import { posterStore } from '$lib/stores/poster.svelte';
import { renderPosterToPng, sanitizeForFilename, type ExportScale } from './export';

const TARGET_DPI = 300;

function pixelsToMm(pixels: number, scale: ExportScale): number {
	const dpi = (TARGET_DPI / 4) * scale;
	return (pixels / dpi) * MM_PER_INCH;
}

function getPosterDimensionsMm(scale: ExportScale): { width: number; height: number } {
	const scaledWidth = posterStore.posterWidth * scale;
	const scaledHeight = posterStore.posterHeight * scale;
	return {
		width: pixelsToMm(scaledWidth, scale),
		height: pixelsToMm(scaledHeight, scale)
	};
}

function drawCropMarks(
	pdf: jsPDF,
	pageWidth: number,
	pageHeight: number,
	bleedMm: number
): void {
	const offset = CROP_MARK_OFFSET_MM;
	const length = CROP_MARK_LENGTH_MM;

	pdf.setDrawColor(0, 0, 0);
	pdf.setLineWidth(0.25);

	const corners = [
		{ x: bleedMm, y: bleedMm },
		{ x: pageWidth - bleedMm, y: bleedMm },
		{ x: bleedMm, y: pageHeight - bleedMm },
		{ x: pageWidth - bleedMm, y: pageHeight - bleedMm }
	];

	corners.forEach(({ x, y }) => {
		const isLeft = x === bleedMm;
		const isTop = y === bleedMm;

		const hDir = isLeft ? -1 : 1;
		const vDir = isTop ? -1 : 1;

		pdf.line(x + hDir * offset, y, x + hDir * (offset + length), y);
		pdf.line(x, y + vDir * offset, x, y + vDir * (offset + length));
	});
}

export interface PDFExportOptions {
	scale: ExportScale;
	raceName: string;
	date: Date | null;
}

export function generatePdfFilename(
	raceName: string,
	date: Date | null,
	scale: ExportScale
): string {
	const sanitizedName = sanitizeForFilename(raceName) || 'poster';
	const parts = [sanitizedName];

	if (date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		parts.push(`${year}-${month}-${day}`);
	}

	parts.push(`${scale}x`);
	return `${parts.join('_')}.pdf`;
}

export async function exportPosterToPdf(options: PDFExportOptions): Promise<void> {
	const { scale, raceName, date } = options;

	const posterMm = getPosterDimensionsMm(scale);
	const pageWidthMm = posterMm.width + 2 * BLEED_MM;
	const pageHeightMm = posterMm.height + 2 * BLEED_MM;

	const isLandscape = posterStore.isLandscape;

	const pdf = new jsPDF({
		orientation: isLandscape ? 'landscape' : 'portrait',
		unit: 'mm',
		format: isLandscape ? [pageHeightMm, pageWidthMm] : [pageWidthMm, pageHeightMm]
	});

	// Get actual page dimensions from jsPDF (accounts for orientation swap)
	const actualPageWidth = pdf.internal.pageSize.getWidth();
	const actualPageHeight = pdf.internal.pageSize.getHeight();

	const bgColor = posterStore.effectiveBgColor;
	const hexToRgb = (hex: string) => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				}
			: { r: 255, g: 255, b: 255 };
	};
	const rgb = hexToRgb(bgColor);
	pdf.setFillColor(rgb.r, rgb.g, rgb.b);
	pdf.rect(0, 0, actualPageWidth, actualPageHeight, 'F');

	const pngDataUrl = await renderPosterToPng(scale);

	pdf.addImage(pngDataUrl, 'PNG', BLEED_MM, BLEED_MM, posterMm.width, posterMm.height);

	drawCropMarks(pdf, actualPageWidth, actualPageHeight, BLEED_MM);

	const filename = generatePdfFilename(raceName, date, scale);
	pdf.save(filename);
}
