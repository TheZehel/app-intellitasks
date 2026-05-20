#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$ROOT_DIR/src/main/java"
BUILD_DIR="$ROOT_DIR/build/classes"

mkdir -p "$BUILD_DIR"
find "$BUILD_DIR" -type f -name '*.class' -delete
javac -encoding UTF-8 -d "$BUILD_DIR" $(find "$SRC_DIR" -name '*.java')
java -cp "$BUILD_DIR" br.edu.intellitasks.IntelliTasksApplication
