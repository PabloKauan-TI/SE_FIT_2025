<script setup></script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="md:w-8/12 lg:w-6/12 mx-auto">
            <div class="w-full bg-surface-0 dark:bg-surface-900 py-5 px-5 sm:px-5" style="border-radius: 53px">
                <div class="card p-fluid">
                    <div class="text-center mb-8">
                        <div class="font-semibold text-xl text-center mb-4">Cadastro</div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to FIT 2K25!</div>
                    </div>
                    <div class="field">
                        <label for="nome" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Nome</label>
                        <InputText id="nome" type="text" />

                        <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email" type="email" />

                        <label for="escola" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Escola</label>
                        <InputText id="escola" type="text" />

                        <label for="indentifield" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Identificação</label>
                        <InputText id="indentifield" type="text" />
                        <Message size="small" severity="secondary" variant="simple">Se for aluno da UFC, digite sua matrícula. Se for público externo, digite seu CPF.</Message>

                        <label for="senha" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Senha</label>
                        <Password id="senha" type="password" :toggleMask="true" class="mb-4" fluid :feedback="false" />
                    </div>
                    <Button label="Criar conta" class="w-full" @click="Login" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
