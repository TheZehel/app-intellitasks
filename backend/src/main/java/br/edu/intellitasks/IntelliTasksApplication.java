package br.edu.intellitasks;

import br.edu.intellitasks.http.ApiServer;

public class IntelliTasksApplication {
  public static void main(String[] args) throws Exception {
    int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
    new ApiServer(port).start();
  }
}
