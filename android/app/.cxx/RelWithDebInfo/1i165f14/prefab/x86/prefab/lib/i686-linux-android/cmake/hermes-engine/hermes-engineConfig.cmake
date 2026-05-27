if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/saif/.gradle/caches/8.12/transforms/1c4748f7115239869623cdcf7631561c/transformed/jetified-hermes-android-0.78.1-release/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/saif/.gradle/caches/8.12/transforms/1c4748f7115239869623cdcf7631561c/transformed/jetified-hermes-android-0.78.1-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

