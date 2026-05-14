export default function PrivacidadPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-6 space-y-6">
      <h1 className="text-3xl font-black text-gray-900">Política de Privacidad</h1>
      <p className="text-gray-600 font-medium leading-relaxed">
        En Figumatch, valoramos tu privacidad. Esta política describe cómo manejamos tu información personal.
      </p>
      
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">1. Datos que recolectamos</h2>
        <p className="text-gray-600">
          Recolectamos tu nombre, correo electrónico y edad para proporcionarte una experiencia personalizada de canje de figuritas.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">2. Uso de la información</h2>
        <p className="text-gray-600">
          Tu inventario de figuritas es visible para otros usuarios para facilitar los intercambios (canjes). No compartimos tu email con terceros.
        </p>
      </section>

      <section className="space-y-4 border-t pt-6">
        <p className="text-[10px] text-gray-400 font-bold uppercase">Última actualización: 13 de mayo, 2026</p>
      </section>
    </div>
  )
}
