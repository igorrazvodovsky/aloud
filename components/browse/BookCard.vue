<template>
  <div class="book-card">
    <div class="overline text--secondary">{{book.author}}</div>
    <p class="headline text--primary mb-0">{{book.title}}</p>
    <svg
      class="book-card-border"
      id="svg"
      width="100%"
      height="80"
      viewBox="-251 -451 502 302"
      preserveAspectRatio="none"
    >
      <defs>
        <filter
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
          id="roughPaper"
        >
          <feTurbulence type="fractalNoise" baseFrequency="128" numOctaves="1" result="noise" />
          <feDiffuseLighting in="noise" lighting-color="white" surfaceScale="1" result="diffLight">
            <feDistantLight azimuth="45" elevation="55" />
          </feDiffuseLighting>
          <feGaussianBlur in="diffLight" stdDeviation="0.75" result="dlblur" />
          <feComposite
            operator="arithmetic"
            k1="1.2"
            k2="0"
            k3="0"
            k4="0"
            in="dlblur"
            in2="SourceGraphic"
            result="out"
          />
        </filter>
        <filter
          x="-2%"
          y="-2%"
          width="104%"
          height="104%"
          filterUnits="objectBoundingBox"
          id="PencilTexture"
        >
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" result="noise" />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="3"
            in="SourceGraphic"
            result="newSource"
          />
        </filter>
        <filter
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
          id="pencilTexture2"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2"
            numOctaves="5"
            stitchTiles="stitch"
            result="f1"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5"
            result="f2"
          />
          <feComposite operator="in" in2="f2" in="SourceGraphic" result="f3" />
        </filter>
        <filter
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
          id="pencilTexture3"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.5"
            numOctaves="5"
            stitchTiles="stitch"
            result="f1"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5"
            result="f2"
          />
          <feComposite operator="in" in2="f2b" in="SourceGraphic" result="f3" />
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" result="noise" />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="2.5"
            in="f3"
            result="f4"
          />
        </filter>
        <filter
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          id="pencilTexture4"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="5"
            seed="1"
            result="f1"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="5"
            in="SourceGraphic"
            in2="f1"
            result="f4"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="5"
            seed="10"
            result="f2"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="5"
            in="SourceGraphic"
            in2="f2"
            result="f5"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="5"
            seed="100"
            result="f3"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="3"
            in="SourceGraphic"
            in2="f3"
            result="f6"
          />
          <feBlend mode="multiply" in2="f4" in="f5" result="out1" />
          <feBlend mode="multiply" in="out1" in2="f6" result="out2" />
        </filter>
        <filter
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          id="pencilTexture5"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2"
            numOctaves="5"
            stitchTiles="stitch"
            result="t1"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5"
            result="t2"
          />
          <feComposite operator="in" in2="t2" in="SourceGraphic" result="SourceTextured" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="5"
            seed="1"
            result="f1"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="5"
            in="SourceTextured"
            in2="f1"
            result="f4"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="5"
            seed="10"
            result="f2"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="5"
            in="SourceTextured"
            in2="f2"
            result="f5"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="5"
            seed="100"
            result="f3"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="3"
            in="SourceTextured"
            in2="f3"
            result="f6"
          />
          <feBlend mode="multiply" in2="f4" in="f5" result="out1" />
          <feBlend mode="multiply" in="out1" in2="f6" result="out2" />
        </filter>
      </defs>

      <g filter="url(#pencilTexture5)">
        <path
          d="M-250,-450L250,-450L250,-150L-250,-150L-250,-450L-250,-450L-250,-450L-250,-450L-251,-450L-250,-450M-250,-450L-251,-149L250,-149L251,-451L-250,-451L-250,-451L-250,-450L-251,-449L-250,-449L-250,-449"
          style="stroke: none; fill-opacity: 0.3; fill: black;"
        />
      </g>
    </svg>
  </div>
</template>
<script>
export default {
  props: ["book", "current"]
};
</script>
