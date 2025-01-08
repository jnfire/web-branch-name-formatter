<template>
  <footer class="footer">
    <div class="footer__content">
      <p class="footer__text">
        Would you like to improve this branch name generator?
        <a
          href="https://github.com/jnfire/web-branch-name-formatter"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__link"
        >
          Collaborate on GitHub!
        </a>
      </p>
      <p class="footer__license">
        Released under Mozilla Public License Version 2.0 -
        <a
          href="https://github.com/jnfire/web-branch-name-formatter/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__link"
        >
          View license
        </a>
      </p>
    </div>
  </footer>
</template>

<style scoped lang="sass">
.footer
  background-color: $color-dark-blue
  width: 100%
  padding: 1rem 3.5rem
  margin-top: auto

  &__content
    text-align: center

  &__text, &__license
    color: $color-beige
    font-size: 14px
    margin: 0.5rem 0

  &__license
    font-size: 11px

  &__link
    color: $color-beige
    text-decoration: underline
    transition: opacity 0.2s ease

    &:hover
      opacity: 0.8

  @media (max-width: 768px)
    padding: 1rem
</style>
