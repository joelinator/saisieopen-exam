<template>
    <footer class="new-footer">
        <div class="new-footer__top">
            <router-link class="text-white" to="/apropos">A Propos</router-link>
            <router-link class="text-white" to="/aide">Aide</router-link>
            <router-link class="text-white" to="/conditions"
                >Conditions d'utilisations</router-link
            >
        </div>

        <!-- -->
        <hr class="mt-2" />
        <!-- -->

        <div class="new-footer__bottom">
            <div class="bottom__left">
                <img src="/images/logo/logo.png" alt="logo" />
                <div class="social">
                    <a href="#" class="mr-4">
                        <i class="fa fa-facebook fa-2x" aria-hidden="true"></i>
                    </a>
                    <a href="#" class="">
                        <i class="fa fa-twitter fa-2x" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
            <div class="bottom__right">
                <div class="font-bold italic">powered by</div>
                <div>
                    <img
                        src="/images/logo/upgradelogo.png"
                        alt="upgrade logo"
                    />
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: "NewFooter"
};
</script>

<style lang="scss" scoped>
.new-footer {
    padding: 20px;
    background-color: #014358;
    color: white;

    &__top {
        display: flex;
        justify-content: center;

        @media (max-width: 540px) {
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-evenly;
        }

        a {
            transition: 0.3s;
            padding-bottom: 2px;
            border-bottom: 1px dashed rgba(0, 0, 0, 0);

            &.nuxt-link-active {
                border-bottom: 1px solid white;
            }
            &:hover {
                border-bottom: 1px dashed white;
            }
        }
        a:not(:last-child) {
            margin-right: 30px;
        }
    }
    &__bottom {
        display: flex;
        justify-content: space-between;
        @media (max-width: 386px) {
            flex-direction: column;
            align-items: center;
        }
    }
}

.bottom {
    &__left {
        display: flex;
        align-items: center;
        @media (max-width: 472px) {
            flex-direction: column;
            align-items: flex-start;
        }
        @media (max-width: 386px) {
            align-items: center;
        }
        img {
            transform: scale(0.8);
        }
    }

    &__right {
        @media (max-width: 386px) {
            text-align: center;
        }
    }
}
</style>
