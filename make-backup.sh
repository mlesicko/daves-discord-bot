#!/bin/bash
mkdir -p backups
cp data.json "backups/$(date).json"
