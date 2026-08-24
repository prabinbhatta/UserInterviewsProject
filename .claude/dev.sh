#!/bin/bash
export PATH="/opt/homebrew/bin:$PATH"
cd "$(dirname "$(dirname "${BASH_SOURCE[0]}")")"
exec npm run dev
