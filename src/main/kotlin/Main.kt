import io.javalin.Javalin

fun main(args: Array<String>) {
    println("QQ收集表!")
    var app = Javalin.create()
        app.get("/api"){ctx -> ctx.result(ctx.queryParam("name")+"-"+ctx.queryParam("value"))}
        .start(6060)
}