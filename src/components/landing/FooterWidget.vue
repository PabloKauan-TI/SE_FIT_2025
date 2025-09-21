<template>
    <div class="py-12 px-6 lg:px-20 bg-black text-white">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div class="flex flex-col items-center md:items-start text-center md:text-left">
                <div class="flex items-center">
                    <img src="/logo_fit_b.svg" alt="Logo FIT" class="h-10 mr-3" />
                    <h4 class="font-bold text-3xl">FIT</h4>
                </div>
                <p class="text-gray-400 mt-4">Descrição</p>
            </div>
            
            <div class="text-center">
                <h4 class="font-bold text-xl mb-4">Links Úteis</h4>
                <ul class="list-none p-0 m-0">
                    <li class="mb-3"><a href="#" class="text-gray-400 hover:text-white">Sobre o Evento</a></li>
                    <li class="mb-3"><a href="#" class="text-gray-400 hover:text-white">Programação</a></li>
                    <li class="mb-3"><a href="#" class="text-gray-400 hover:text-white">Contato</a></li>
                </ul>
            </div>

            <div class="flex flex-col items-center md:items-end">
                <h4 class="font-bold text-xl mb-4">Siga-nos</h4>
                <div class="flex gap-4">
                    <a href="#" class="w-10 h-10 bg-surface-800 hover:bg-primary rounded-full flex items-center justify-center"><i class="pi pi-instagram text-xl"></i></a>
                    <a href="#" class="w-10 h-10 bg-surface-800 hover:bg-primary rounded-full flex items-center justify-center"><i class="pi pi-facebook text-xl"></i></a>
                    <a href="#" class="w-10 h-10 bg-surface-800 hover:bg-primary rounded-full flex items-center justify-center"><i class="pi pi-linkedin text-xl"></i></a>
                </div>
            </div>
        </div>

        <Divider class="w-full bg-surface-700 my-8"></Divider>
        <div class="text-center text-gray-500">
            © 2025 FIT - Fórum de Inovação e Tecnologia. Todos os direitos reservados.
        </div>
    </div>
</template>