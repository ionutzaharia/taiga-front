#############################################################################
## Animated Counter
#############################################################################
AnimatedCounter = () ->
    template = """
        <div class="animated-counter-inner">
            <div class="counter-translator">
                <span>{{ nextUp }}</span>
                <span>{{ currentCount }}</span>
                <span>{{ nextDown }}</span>
            </div>
        </div>
    """

    link = ($scope, $el, $attrs) ->
        transitionEnd = (event) ->
            $scope.$evalAsync () =>
                if $scope.nextUp != undefined
                    $scope.currentCount = $scope.nextUp
                else
                    $scope.currentCount = $scope.nextDown

                $(counter).removeClass('inc dec')

        counter = $el.find('.counter-translator')
        counter.on('transitionend', transitionEnd)

        $scope.$watch 'count', () ->
            $scope.nextUp = undefined
            $scope.nextDown = undefined

            if $scope.count == undefined
                $scope.currentCount = 0
                return
            else if $scope.currentCount == $scope.count
                return
            # $scope.initialLoad, wait empty @.queue to animate
            else if !$scope.initialLoad || $scope.currentCount == undefined
                $scope.currentCount = $scope.count
                return

            if $scope.count > $scope.currentCount
                $scope.nextUp = $scope.count
            else if $scope.count < $scope.currentCount
                $scope.nextDown = $scope.count

            if $scope.nextUp != undefined || $scope.nextDown != undefined
                counter.removeClass('inc dec')

                $scope.$evalAsync () =>
                    if $scope.nextUp != undefined
                        counter.addClass('inc')
                    else if $scope.nextDown != undefined
                        counter.addClass('dec')

        $scope.$on "$destroy", ->
            $el.off()
            counter.off()

    return {
        link: link,
        template: template,
        scope: {
            count: '<',
            initialLoad: '<'
        },
    }

angular.module('taigaComponents').directive("tgAnimatedCounter", [AnimatedCounter])
