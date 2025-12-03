if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/hf/.gradle/caches/8.12/transforms/3496e2a0d5dc12487f7bca91b54d6dc2/transformed/jetified-hermes-android-0.78.1-debug/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/hf/.gradle/caches/8.12/transforms/3496e2a0d5dc12487f7bca91b54d6dc2/transformed/jetified-hermes-android-0.78.1-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

