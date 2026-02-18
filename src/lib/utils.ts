const turkishMap: Record<string, string> = {
  'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
  'Ç': 'C', 'Ğ': 'G', 'I': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function slugifyTag(tag: string): string {
  return slugify(tag);
}

export function slugifySeries(name: string): string {
  return slugify(name);
}
