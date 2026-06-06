// Guided room checklist templates (SPEC §3). Optional — used when creating rooms.
export interface RoomTemplate {
  name: string;
  checklist: string[];
}

export const ROOM_TEMPLATES: RoomTemplate[] = [
  {
    name: 'Kitchen',
    checklist: [
      'Stove',
      'Refrigerator',
      'Sink',
      'Cabinets',
      'Countertops',
      'Flooring',
    ],
  },
  {
    name: 'Bathroom',
    checklist: ['Toilet', 'Sink', 'Tub/Shower', 'Mirror', 'Flooring'],
  },
  {
    name: 'Bedroom',
    checklist: ['Walls', 'Flooring', 'Closet', 'Windows'],
  },
  {
    name: 'Living Room',
    checklist: ['Walls', 'Flooring', 'Windows', 'Ceiling'],
  },
];
