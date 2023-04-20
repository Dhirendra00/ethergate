export function shortenAddress(address, length = 7) {
    if (!address) {
      return '';
    }
    const start = address.slice(0, length);
    const end = address.slice(address.length - length);
    return `${start}...${end}`;
  }
  