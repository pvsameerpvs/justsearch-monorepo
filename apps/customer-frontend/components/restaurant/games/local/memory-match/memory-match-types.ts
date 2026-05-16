export const CARD_GAP = 16;
export const CARD_PADDING = 40;

export function getCardLayout(
  width: number,
  height: number,
  cols: number,
  rows: number
) {
  const cardSize = Math.min(
    (width - CARD_PADDING * 2 - (cols - 1) * CARD_GAP) / cols,
    (height - CARD_PADDING * 2 - (rows - 1) * CARD_GAP) / rows
  );
  const offX = (width - (cardSize * cols + CARD_GAP * (cols - 1))) / 2;
  const offY = (height - (cardSize * rows + CARD_GAP * (rows - 1))) / 2;
  return { cardSize, offX, offY, gap: CARD_GAP };
}
