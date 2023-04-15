module.exports = {
    sizes: {
        MEM_128: { memory: 128, cpu: "70m" },
        MEM_256: { memory: 256, cpu: "140m" },
        MEM_512: { memory: 512, cpu: "280m" },
        MEM_1024: { memory: 1024, cpu: "560m" },
        MEM_2048: { memory: 2048, cpu: "1120m" },
        MEM_3072: { memory: 3072, cpu: "1680m" },
        MEM_4096: { memory: 4096, cpu: "2240m" }
    },
    regions: {
        fr: "fr-par",
        nl: "nl-ams",
        pl: "pl-waw"
    },
    privacies: {
        unknown_privacy: "unknown_privacy",
        public: "public",
        private: "private"
    }
};