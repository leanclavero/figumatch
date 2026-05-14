export default function CondicionesPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-6 space-y-6">
      <h1 className="text-3xl font-black text-gray-900">Términos y Condiciones</h1>
      <p className="text-gray-600 font-medium leading-relaxed">
        Al usar Figumatch, aceptas los siguientes términos de uso.
      </p>
      
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">1. Uso del Servicio</h2>
        <p className="text-gray-600">
          Figumatch es una plataforma para conectar coleccionistas de figuritas. No somos responsables de los intercambios físicos realizados entre usuarios.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">2. Conducta del Usuario</h2>
        <p className="text-gray-600">
          Se espera un comportamiento respetuoso en la comunidad. Cualquier conducta abusiva resultará en la suspensión de la cuenta.
        </p>
      </section>

      <section className="space-y-4 border-t pt-6">
        <p className="text-[10px] text-gray-400 font-bold uppercase">Última actualización: 13 de mayo, 2026</p>
      </section>
    </div>
  )
}
