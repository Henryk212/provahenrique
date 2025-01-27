using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();

builder.Services.AddCors(
    options =>
    {
        options.AddPolicy("AcessoTotal",
            builder => builder.
                AllowAnyOrigin().
                AllowAnyHeader().
                AllowAnyMethod());
    }
);

var app = builder.Build();


app.MapGet("/", () => "Prova A1");

//ENDPOINTS DE CATEGORIA
//GET: http://localhost:5000/categoria/listar
app.MapGet("/categoria/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Categorias.Any())
    {
        return Results.Ok(ctx.Categorias.ToList());
    }
    return Results.NotFound("Nenhuma categoria encontrada");
});

//POST: http://localhost:5000/categoria/cadastrar
app.MapPost("/categoria/cadastrar", ([FromServices] AppDataContext ctx, [FromBody] Categoria categoria) =>
{
    ctx.Categorias.Add(categoria);
    ctx.SaveChanges();
    return Results.Created("", categoria);
});

//ENDPOINTS DE TAREFA
//GET: http://localhost:5000/tarefas/listar
app.MapGet("/tarefas/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Tarefas.Any())
    {
        return Results.Ok(ctx.Tarefas.ToList());
    }
    return Results.NotFound("Nenhuma tarefa encontrada");
});



//POST: http://localhost:5000/tarefas/cadastrar
app.MapPost("/tarefas/cadastrar", ([FromServices] AppDataContext ctx, [FromBody] Tarefa tarefa) =>
{
    Categoria? categoria = ctx.Categorias.Find(tarefa.CategoriaId);
    if (categoria == null)
    {
        return Results.NotFound("Categoria não encontrada");
    }
    tarefa.Categoria = categoria;
    ctx.Tarefas.Add(tarefa);
    ctx.SaveChanges();
    return Results.Created("", tarefa);
});

//PUT: http://localhost:5000/tarefas/alterar/{id}
app.MapPut("/tarefas/alterar/{tarefaId}", ([FromRoute] string tarefaId,
    [FromBody] Tarefa novoStatus,
    [FromServices] AppDataContext context) =>
{
    //Endpoint com várias linhas de código    
    Tarefa? tarefa = context.Tarefas.Find(tarefaId);

    if (tarefa is null)
    {
        return Results.NotFound("tarefa não encontrado!");
    }

    tarefa.Status = novoStatus.Status;
    

    context.Tarefas.Update(tarefa);
    context.SaveChanges();

    return Results.Ok("Tarefa alterado com sucesso!");
});

//GET: http://localhost:5000/tarefas/naoconcluidas
app.MapGet("/tarefas/naoconcluidas", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Tarefas.Any(t => t.Status != "Concluída"))
    {
        return Results.Ok(ctx.Tarefas.Where(t => t.Status != "Concluída").ToList());
    }else {
        return Results.NotFound("Nenhuma tarefa não concluída encontrada");
    }
    
});

//GET: http://localhost:5000/tarefas/concluidas
app.MapGet("/tarefas/concluidas", ([FromServices] AppDataContext ctx) =>
{
    if(ctx.Tarefas.Any(t => t.Status == "Concluída")){
        return Results.Ok(ctx.Tarefas.Where(t => t.Status == "Concluída").ToList());
    }else{
        return Results.NotFound("Nenhuma tarefa concluída encontrada");
    }
    
});

app.UseCors("AcessoTotal");
app.Run();
