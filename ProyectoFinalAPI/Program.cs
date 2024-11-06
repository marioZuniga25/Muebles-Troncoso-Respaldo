using Hangfire;
using ProyectoFinalAPI;
using ProyectoFinalAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Configura Hangfire
builder.Services.AddHangfire(config =>
    config.UseSqlServerStorage(builder.Configuration.GetConnectionString("cnProyecto")));
builder.Services.AddHangfireServer();

builder.Services.AddScoped<EmailService>();

builder.Services.AddSqlServer<ProyectoContext>(builder.Configuration.GetConnectionString("cnProyecto"));


builder.Services.AddCors(options =>
{
    options.AddPolicy("NuevaPolitica", app =>
    {
        app.WithOrigins("http://localhost:4200")
           .AllowAnyMethod()
           .AllowAnyHeader()
           .AllowCredentials();
    });
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5194);
});

var app = builder.Build();
// Configura el middleware
app.UseHangfireDashboard(); // A�ade el panel de control de Hangfire
app.UseHangfireServer(); // Inicia el servidor de Hangfire


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("NuevaPolitica");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
var recurringJobManager = app.Services.GetRequiredService<IRecurringJobManager>();
recurringJobManager.AddOrUpdate<PromocionesRandomService>(
    "ActualizarPromocionesRandom",
    service => service.EjecutarPromocionesAleatorias(),
    Cron.Minutely); // Ejecutar cada hora

app.Run();
