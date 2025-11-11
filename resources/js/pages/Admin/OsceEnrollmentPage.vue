<script setup>
defineProps({
    mahasiswa: Object,
    osce_id: Number,
    id_osce_stase: Number,
});
</script>

<template>
    <div class="p-6">
        <h1 class="text-xl font-bold mb-4">Daftar Mahasiswa OSCE</h1>

        <table class="min-w-full border border-gray-300">
            <thead>
                <tr class="bg-gray-100">
                    <th class="px-2 py-1 border">NIM</th>
                    <th class="px-2 py-1 border">Nama</th>
                    <th class="px-2 py-1 border">Kelas</th>
                    <th class="px-2 py-1 border">Status</th>
                    <th class="px-2 py-1 border">Terdaftar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(mhs, i) in mahasiswa.data" :key="i">
                    <td class="border px-2 py-1">{{ mhs.nim }}</td>
                    <td class="border px-2 py-1">{{ mhs.nama }}</td>
                    <td class="border px-2 py-1">{{ mhs.kelas }}</td>
                    <td class="border px-2 py-1">{{ mhs.status }}</td>
                    <td class="border px-2 py-1">
                        <span
                            v-if="mhs.is_enrolled"
                            class="text-green-600 font-semibold"
                            >Ya</span
                        >
                        <span v-else class="text-red-500">Tidak</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
