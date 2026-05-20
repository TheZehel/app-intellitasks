package br.edu.intellitasks.http;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Json {
  public static String stringify(Object value) {
    if (value == null) {
      return "null";
    }

    if (value instanceof String text) {
      return "\"" + escape(text) + "\"";
    }

    if (value instanceof Number || value instanceof Boolean) {
      return String.valueOf(value);
    }

    if (value instanceof Map<?, ?> map) {
      List<String> entries = new ArrayList<>();
      for (Map.Entry<?, ?> entry : map.entrySet()) {
        entries.add(stringify(String.valueOf(entry.getKey())) + ":" + stringify(entry.getValue()));
      }
      return "{" + String.join(",", entries) + "}";
    }

    if (value instanceof Iterable<?> iterable) {
      List<String> items = new ArrayList<>();
      for (Object item : iterable) {
        items.add(stringify(item));
      }
      return "[" + String.join(",", items) + "]";
    }

    return stringify(String.valueOf(value));
  }

  public static Map<String, Object> parseObject(String json) {
    Parser parser = new Parser(json == null ? "" : json);
    return parser.parseObject();
  }

  private static String escape(String text) {
    return text
      .replace("\\", "\\\\")
      .replace("\"", "\\\"")
      .replace("\n", "\\n")
      .replace("\r", "\\r")
      .replace("\t", "\\t");
  }

  private static class Parser {
    private final String text;
    private int index;

    Parser(String text) {
      this.text = text.trim();
    }

    Map<String, Object> parseObject() {
      Map<String, Object> result = new LinkedHashMap<>();
      skipWhitespace();
      expect('{');
      skipWhitespace();

      while (peek() != '}') {
        String key = parseString();
        skipWhitespace();
        expect(':');
        skipWhitespace();
        result.put(key, parseValue());
        skipWhitespace();

        if (peek() == ',') {
          index++;
          skipWhitespace();
        } else {
          break;
        }
      }

      expect('}');
      return result;
    }

    private Object parseValue() {
      char next = peek();

      if (next == '"') {
        return parseString();
      }

      if (text.startsWith("true", index)) {
        index += 4;
        return true;
      }

      if (text.startsWith("false", index)) {
        index += 5;
        return false;
      }

      if (text.startsWith("null", index)) {
        index += 4;
        return null;
      }

      int start = index;
      while (index < text.length() && ",}".indexOf(text.charAt(index)) == -1) {
        index++;
      }
      return text.substring(start, index).trim();
    }

    private String parseString() {
      expect('"');
      StringBuilder builder = new StringBuilder();

      while (index < text.length()) {
        char current = text.charAt(index++);

        if (current == '"') {
          break;
        }

        if (current == '\\' && index < text.length()) {
          char escaped = text.charAt(index++);
          builder.append(switch (escaped) {
            case 'n' -> '\n';
            case 'r' -> '\r';
            case 't' -> '\t';
            default -> escaped;
          });
        } else {
          builder.append(current);
        }
      }

      return builder.toString();
    }

    private char peek() {
      return index < text.length() ? text.charAt(index) : '\0';
    }

    private void expect(char expected) {
      if (peek() != expected) {
        throw new IllegalArgumentException("JSON invalido.");
      }
      index++;
    }

    private void skipWhitespace() {
      while (index < text.length() && Character.isWhitespace(text.charAt(index))) {
        index++;
      }
    }
  }
}
