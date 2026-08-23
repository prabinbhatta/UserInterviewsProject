#!/bin/bash
export PATH="/opt/homebrew/bin:$PATH"
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec npm run dev
